function caclulateDateNext(date: Date) {
  return new Date(date.getTime() + Math.floor(Math.random() * 5) + 1 * 3600000);
}
