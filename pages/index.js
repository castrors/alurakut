import React from "react";
import nookies from "nookies";
import jwt from "jsonwebtoken";
import MainGrid from "../src/components/MainGrid";
import Box from "../src/components/Box";
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet,
} from "../src/lib/AlurakutCommons";
import { ProfileRelationsBoxWrapper } from "../src/components/ProfileRelations";

function ProfileSidebar(props) {
  return (
    <Box as="aside">
      <img
        src={`https://github.com/${props.githubUser}.png`}
        style={{ borderRadius: "8px" }}
      />
      <hr />

      <p>
        <a className="boxLink" href={`https://github.com/${props.githubUser}`}>
          @{props.githubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  );
}

function ProfileRelationsBox(props) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {props.title} ({props.items.length})
      </h2>
      <ul>
        {props.items.slice(0, 6).map((itemAtual) => {
          return (
            <li key={itemAtual.id}>
              <a href={`/communities/${itemAtual.id}`}>
                <img src={itemAtual.imageUrl} />
                <span>{itemAtual.title}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  );
}

function mapPessoaToObject(pessoa) {
  return {
    id: `id_${pessoa}`,
    title: pessoa,
    imageUrl: `https://github.com/${pessoa}.png`,
  };
}

export default function Home(props) {
  const githubUser = props.githubUser;
  const [comunidades, setComunidades] = React.useState([]);
  const pessoasFavoritas = [
    "walmyrcarvalho",
    "schirrel",
    "RafaelBarbosatec",
    "DiegoSCastro",
    "rafaeltoledo",
    "alvarowolfx",
  ];

  const [seguidores, setSeguidores] = React.useState([]);

  React.useEffect(function () {
    fetch("https://api.github.com/users/castrors/followers")
      .then(function (respostaDoServidor) {
        return respostaDoServidor.json();
      })
      .then(function (respostaCompleta) {
        setSeguidores(respostaCompleta);
      });

    // API GraphQL
    fetch("https://graphql.datocms.com/", {
      method: "POST",
      headers: {
        Authorization: "75cda71d6a6ed5c76d2d1d16d18e0b",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `query {
          allCommunities {
            id
            title
            imageUrl
            creatorSlug
          }
        }`,
      }),
    })
      .then((response) => response.json())
      .then((respostaCompleta) => {
        const comunidadesDato = respostaCompleta.data.allCommunities;
        setComunidades(comunidadesDato);
      });
  }, []);

  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: "profileArea" }}>
          <ProfileSidebar githubUser={githubUser} />
        </div>

        <div className="welcomeArea" style={{ gridArea: "welcomeArea" }}>
          <Box>
            <h1 className="title">Bem vindo(a)</h1>

            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form
              onSubmit={function handleCreateCommunity(event) {
                event.preventDefault();
                const formData = new FormData(event.target);

                const comunidade = {
                  title: formData.get("title"),
                  imageUrl: formData.get("image"),
                  creatorSlug: githubUser,
                };

                fetch("/api/comunidades", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(comunidade),
                }).then(async (response) => {
                  const dados = await response.json();
                  console.log(dados.registroCriado);
                  const comunidade = dados.registroCriado;
                  setComunidades([...comunidades, comunidade]);
                });
              }}
            >
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                />
              </div>
              <button>Criar comunidade</button>
            </form>
          </Box>
        </div>

        <div
          className="profileRelationsArea"
          style={{ gridArea: "profileRelationsArea" }}
        >
          <ProfileRelationsBox
            title="Seguidores"
            items={seguidores.map((pessoa) => mapPessoaToObject(pessoa.login))}
          />

          <ProfileRelationsBox title="Comunidades" items={comunidades} />

          <ProfileRelationsBox
            title="Pessoas da Comunidade"
            items={pessoasFavoritas.map(mapPessoaToObject)}
          />
        </div>
      </MainGrid>
    </>
  );
}

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);
  const token = cookies.USER_TOKEN;

  const { isAuthenticated } = await fetch(
    "https://alurakut.vercel.app/api/auth",
    {
      headers: {
        Authorization: token,
      },
    }
  ).then((resposta) => resposta.json());
  if (!isAuthenticated) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const { githubUser } = jwt.decode(token);

  return {
    props: {
      githubUser,
    },
  };
}
