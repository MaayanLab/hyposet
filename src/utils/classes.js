export default function classes(C) {
  const classNames = []
  for (const c in C) {
    if (C[c]) classNames.push(c)
  }
  return classNames.join(' ')
}