export function setLengthWith<T>(a: T[], newLen: number, filler: T): T[] {
  if (a.length >= newLen) {
    return a.slice(0, newLen);
  } else {
    return a.concat(Array(newLen - a.length).fill(filler));
  }
}
