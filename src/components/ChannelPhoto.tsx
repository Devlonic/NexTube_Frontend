export const ChannelPhoto = (props: {
  photoFileId: string | undefined | null;
}) => {
  return (
    <>
      <span>
        {props.photoFileId && (
          <img
            className="h-12 min-w-[3rem] min-h-[3rem] w-12 rounded-full"
            src={'/api/Photo/GetPhotoUrl/' + props.photoFileId + '/50'}
            alt="User"
          />
        )}
      </span>
    </>
  );
};
