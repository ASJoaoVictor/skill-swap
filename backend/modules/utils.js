import { prisma } from "./prisma.js";

const categoriasHabilidades = [
  "Música",
  "Pintura",
  "Desenho",
  "Escultura",
  "Fotografia",
  "Dança",
  "Teatro",
  "Escrita",
  "Poesia",
  "Culinária",
  "Programação",
  "Design",
  "Artesanato",
  "Costura",
  "Marcenaria",
  "Jardinagem",
  "Esportes",
  "Idiomas",
  "Marketing",
  "Liderança",
  "Comunicação",
  "Oratória",
  "Edição de Vídeo",
  "Produção Musical",
  "Animação",
  "Modelagem 3D",
  "Ilustração",
  "Maquiagem",
  "Yoga",
  "Meditação"
];

async function createCategory(c){
    const category = await prisma.category.create({
        data: {
            name: c
        }
    })
}

for(let categoria of categoriasHabilidades){
    createCategory(categoria);
}