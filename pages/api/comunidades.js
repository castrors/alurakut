import { SiteClient } from "datocms-client";

export default async function recebedorDeRequests(request, response) {
  if (request.method == "POST") {
    const TOKEN = "64d268a13908e85efdb26b66721fb0";
    const client = new SiteClient(TOKEN);

    const registroCriado = await client.items.create({
      itemType: "967987",
      ...request.body,
    });

    response.json({
      dados: "Algum dado qualquer",
      registroCriado: registroCriado,
    });

    return;
  }

  response.status(404).json({
    message: "Ainda não temos nada no GET, mas no POST tem!",
  });
}
