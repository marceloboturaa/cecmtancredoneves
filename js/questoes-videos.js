const videoGroups = {
  oqe: { youtubeId: 'CB5zuxQl5ro', titulo: 'O que e educacao financeira', descricao: 'Video de apoio sobre uso consciente do dinheiro, escolhas e planejamento.' },
  con: { youtubeId: '-C_wnHh0E4c', titulo: 'Como organizar financas com a regra 50 30 20', descricao: 'Video de apoio sobre orcamento, receitas, despesas e organizacao financeira.' },
  his: { youtubeId: '-7Az6V2oAD4', titulo: 'Banco Central do Brasil', descricao: 'Video de apoio sobre historia do dinheiro e educacao financeira.' },
  moe: { youtubeId: 'T5I1s_NEnx8', titulo: 'Educacao financeira na pratica', descricao: 'Video de apoio para relacionar valor, trocas e evolucao do dinheiro.' },
  jur: { youtubeId: 'Popa7dOjOMU', titulo: 'Juros compostos na pratica', descricao: 'Video de apoio sobre acumulacao, tempo e impacto dos juros.' },
  pla: { youtubeId: 'SEUFoQhp-KI', titulo: 'Consumo consciente e planejamento', descricao: 'Video de apoio sobre planejamento ao consumo e escolhas responsaveis.' }
};

const sitePageVideos = [
  { youtubeId: '-7Az6V2oAD4', titulo: 'Banco Central do Brasil', descricao: 'Video de apoio sobre a historia do dinheiro e educacao financeira.' },
  { youtubeId: 'T5I1s_NEnx8', titulo: 'Educacao Financeira na pratica', descricao: 'Video complementar para ampliar a leitura sobre escolhas financeiras e consumo consciente.' },
  { youtubeId: 'Popa7dOjOMU', titulo: 'Educacao Financeira - video complementar 1', descricao: 'Conteudo em video para aprofundar planejamento, consumo e organizacao financeira.' },
  { youtubeId: '5vpixQc3b2M', titulo: 'Educacao Financeira - video complementar 2', descricao: 'Material em video para reforcar escolhas conscientes e uso responsavel do dinheiro.' },
  { youtubeId: '3PKiaQJdzrM', titulo: 'Educacao Financeira - video complementar 3', descricao: 'Video de apoio para ampliar a reflexao sobre orcamento, metas e decisoes financeiras.' },
  { youtubeId: 'anBcX9yLYdc', titulo: 'Educacao Financeira - video complementar 4', descricao: 'Conteudo em video para estudo e aprofundamento dos temas de educacao financeira.' },
  { youtubeId: '6aolLKTHo-I', titulo: 'Educacao Financeira - video complementar 5', descricao: 'Video extra para reforcar habitos de consumo consciente e planejamento do dia a dia.' },
  { youtubeId: '35QkwQrJzwY', titulo: 'Educacao Financeira - video complementar 6', descricao: 'Material em video com apoio para leitura, analise e discussao em educacao financeira.' },
  { youtubeId: 'AnZge4m995w', titulo: 'Educacao Financeira - video complementar 7', descricao: 'Video complementar para ampliar o repertorio sobre financas e consumo responsavel.' }
].map(function (video) {
  return { ...video, thumb: 'https://img.youtube.com/vi/' + video.youtubeId + '/hqdefault.jpg' };
});

window.questoesVideoMap = {};
Object.keys(videoGroups).forEach(function (prefix) {
  for (let numero = 1; numero <= 10; numero += 1) {
    const id = 'ef-' + prefix + '-' + String(numero).padStart(2, '0');
    const group = videoGroups[prefix];
    window.questoesVideoMap[id] = { youtubeId: group.youtubeId, titulo: group.titulo, descricao: group.descricao };
  }
});

window.questoesVideoCatalog = Object.values(videoGroups).map(function (video) {
  return { ...video, thumb: 'https://img.youtube.com/vi/' + video.youtubeId + '/hqdefault.jpg' };
});

window.sitePageVideoCatalog = sitePageVideos;
window.videoCatalogCompleto = (function () {
  const merged = [];
  const seen = new Set();
  [...window.sitePageVideoCatalog, ...window.questoesVideoCatalog].forEach(function (video) {
    if (!video || !video.youtubeId || seen.has(video.youtubeId)) return;
    seen.add(video.youtubeId);
    merged.push(video);
  });
  return merged;
})();
