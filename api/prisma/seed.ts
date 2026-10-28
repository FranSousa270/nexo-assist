
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("A variável DATABASE_URL não foi definida.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = [
    { name: "Ana Souza", email: "ana.souza@nexo.com.br", role: "EMPLOYEE" as const },
    { name: "Carlos Lima", email: "carlos.lima@nexo.com.br", role: "EMPLOYEE" as const },
    { name: "Marina Costa", email: "marina.costa@nexo.com.br", role: "ANALYST" as const },
    { name: "Rafael Mendes", email: "rafael.mendes@nexo.com.br", role: "ANALYST" as const },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role,
      },
      create: user,
    });
  }

  const articles = [
    {
      title: "Como redefinir a senha corporativa",
      category: "ACCESS" as const,
      content: "Acesse o portal de identidade corporativa e selecione Esqueci minha senha. Confirme sua identidade e siga as instruções enviadas ao e-mail cadastrado. Se não conseguir acessar o portal, solicite apoio ao Service Desk.",
    },
    {
      title: "Solução inicial para erro 809 na VPN",
      category: "NETWORK_VPN" as const,
      content: "Confirme sua conexão com a internet, verifique se a data e a hora do computador estão corretas e tente conectar novamente. Se o erro 809 persistir, registre um chamado informando a mensagem completa e quando o problema começou.",
    },
    {
      title: "Notebook lento ou travando",
      category: "HARDWARE" as const,
      content: "Salve seu trabalho, reinicie o notebook e feche aplicativos desnecessários. Se o problema continuar, informe quando ocorre e quais aplicativos estão abertos ao solicitar suporte.",
    },
    {
      title: "Como solicitar instalação de software",
      category: "SOFTWARE" as const,
      content: "Solicite a instalação por meio de um chamado do tipo requisição. Informe o nome do software, a finalidade de uso e a justificativa profissional. A instalação depende de aprovação e disponibilidade de licença.",
    },
    {
      title: "Problemas para enviar ou receber e-mails",
      category: "EMAIL" as const,
      content: "Verifique a conexão de rede, confirme se sua caixa de correio não está cheia e teste o acesso pelo webmail. Se o problema persistir, informe o destinatário ou remetente afetado, o horário e a mensagem de erro.",
    },
  ];

  for (const article of articles) {
    const existing = await prisma.knowledgeArticle.findFirst({
      where: { title: article.title },
    });

    if (existing) {
      await prisma.knowledgeArticle.update({
        where: { id: existing.id },
        data: {
          category: article.category,
          content: article.content,
          published: true,
        },
      });
    } else {
      await prisma.knowledgeArticle.create({
        data: article,
      });
    }
  }

  
  const ana = await prisma.user.findUniqueOrThrow({
    where: { email: "ana.souza@nexo.com.br" },
  });

  const carlos = await prisma.user.findUniqueOrThrow({
    where: { email: "carlos.lima@nexo.com.br" },
  });

  const marina = await prisma.user.findUniqueOrThrow({
    where: { email: "marina.costa@nexo.com.br" },
  });

  const now = new Date();

  const tickets = [
    {
      number: "INC-20617",
      title: "Falha de conexão com a VPN",
      description: "Notebook não conecta à VPN e apresenta erro 809.",
      type: "INCIDENT" as const,
      category: "NETWORK_VPN" as const,
      priority: "HIGH" as const,
      status: "IN_PROGRESS" as const,
      affectedUserId: ana.id,
      createdById: ana.id,
      assignedToId: marina.id,
      dueAt: new Date(now.getTime() + 4 * 60 * 60 * 1000),
    },
    {
      number: "REQ-20618",
      title: "Instalação de software",
      description: "Solicitação de instalação de uma ferramenta de trabalho.",
      type: "REQUEST" as const,
      category: "SOFTWARE" as const,
      priority: "MEDIUM" as const,
      status: "OPEN" as const,
      affectedUserId: ana.id,
      createdById: ana.id,
      assignedToId: null,
      dueAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
    },
    {
      number: "INC-20619",
      title: "Problema no recebimento de e-mails",
      description: "Mensagens novas não aparecem na caixa de entrada.",
      type: "INCIDENT" as const,
      category: "EMAIL" as const,
      priority: "HIGH" as const,
      status: "WAITING" as const,
      affectedUserId: carlos.id,
      createdById: carlos.id,
      assignedToId: marina.id,
      dueAt: new Date(now.getTime() + 2 * 60 * 60 * 1000),
    },
    {
      number: "INC-20620",
      title: "Acesso ao sistema corporativo",
      description: "Usuário não consegue acessar o sistema interno.",
      type: "INCIDENT" as const,
      category: "ACCESS" as const,
      priority: "LOW" as const,
      status: "RESOLVED" as const,
      affectedUserId: carlos.id,
      createdById: carlos.id,
      assignedToId: marina.id,
      dueAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      resolvedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    },
  ];

  for (const ticket of tickets) {
    const { number, ...data } = ticket;

    await prisma.ticket.upsert({
      where: { number },
      update: data,
      create: { number, ...data },
    });
  }


  console.log("Dados iniciais cadastrados com sucesso.");
}

main()
  .catch((error) => {
    console.error("Erro ao cadastrar dados iniciais:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
