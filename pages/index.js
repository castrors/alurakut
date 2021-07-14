import React from "react";
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
        {props.items.slice(0,6).map((itemAtual) => {
          return (
            <li key={itemAtual.id}>
              <a href={itemAtual.link}>
                <img src={itemAtual.image} />
                <span>{itemAtual.title}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  );
}

function mapPessoaToObject(pessoa){
  return {
    id: `id_${pessoa}`,
    title: pessoa,
    image: `https://github.com/${pessoa}.png`,
    link: `https://github.com/${pessoa}`,
  };
}

export default function Home() {
  const githubUser = "castrors";
  const [comunidades, setComunidades] = React.useState([
    {
      id: "234234234234",
      title: "Eu odeio acordar cedo",
      image: "https://alurakut.vercel.app/capa-comunidade-01.jpg",
    },
  ]);
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
                const formData = new FormData(e.target);

                const comunidade = {
                  id: new Date().toISOString(),
                  title: formData.get("title"),
                  image: formData.get("image"),
                };

                setComunidades([...comunidades, comunidade]);
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
          <ProfileRelationsBox title="Seguidores" items={seguidores.map((pessoa) =>mapPessoaToObject(pessoa.login))} />

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
