export default function inlineSort(L, cmp) {
  const S = [...L]
  S.sort(cmp)
  return S
}