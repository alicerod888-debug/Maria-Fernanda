// Cadastre aqui os produtos. Para cada item preencha: nome, descricao, preco (número, ex.: 42.9) e foto (ex.: "assets/produtos/x.jpg").
// Itens sem nome aparecem como "a cadastrar" e não podem ser adicionados ao pedido.
const cat = (id, nome, qtd, extra = {}) => ({
  id, nome, ...extra,
  itens: Array.from({ length: qtd }, (_, i) => ({ id: `${id}-${i + 1}`, nome: "", descricao: "", preco: null, foto: "" })),
});
export const CATEGORIAS = [
  cat("drinks", "Drinks", 14),
  cat("destilados", "Vodkas e Destilados (Dose)", 5),
  cat("whisky", "Whisky (Dose)", 5),
  cat("saladas", "Saladas", 3),
  cat("grelhados", "Grelhados", 3),
  cat("entradas-1", "Entradas / Petiscos", 10),
  cat("massas", "Massas / Risotos", 9),
  cat("sobremesas", "Sobremesas", 6),
  cat("digestivos", "Digestivos", 2),
  cat("carnes", "Carnes / Aves", 5),
  cat("peixes", "Peixes / Mariscos", 4),
  cat("parmegianas", "Parmegianas", 3, { acompanhamentos: true }),
  cat("kids", "Menu Kids", 3),
  cat("guarnicoes", "Guarnições", 8),
  cat("entradas-2", "Entradas / Petiscos", 13),
  cat("bebidas", "Bebidas", 10),
  cat("cervejas", "Cervejas", 6),
];
