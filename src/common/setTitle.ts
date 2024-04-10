const setTitle = (title: string | null) => {
  document.title = `${title ?? 'No title'} - NexTube`;
};
export default setTitle;
