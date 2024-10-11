export default function DOCXPreview({ url }) {
  return (
    <iframe
      src={`https://docs.google.com/gview?url=${url}&embedded=true`}
      width="100%"
      height="100%"
    />
  );
}
