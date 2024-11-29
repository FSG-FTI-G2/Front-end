/**
 * @param {{
 * url: string
 * }} props
 * @returns {JSX.Element}
 */
export default function DOCXPreview({ url }) {
  return (
    <iframe
      src={`https://view.officeapps.live.com/op/view.aspx?src=${url}`}
      width="100%"
      height="100%"
    />
  );
}
