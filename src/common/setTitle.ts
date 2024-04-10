const setTitle = (title: string | null) => {
  document.title = `${title ? title + ' - ' : ''}NexTube`;
};
export default setTitle;
