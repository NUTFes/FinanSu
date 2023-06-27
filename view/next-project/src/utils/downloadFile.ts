export const downloadFile = async ({
  downloadContent,
  fileName,
  isBomAdded,
}: {
  downloadContent: (() => Promise<string | File | Blob>) | string | File | Blob;
  fileName?: string;
  isBomAdded?: boolean;
}) => {
  if (!window) return;
  let content: Blob | string;

  if (typeof downloadContent === 'function') {
    let response: string | File | Blob | Promise<string | File | Blob> = (
      downloadContent as () => Promise<string | File | Blob>
    )();

    if (response instanceof Promise) {
      const promiseResponse = await response.catch(console.error);
      if (!promiseResponse) return;
      response = promiseResponse;
    }
    content = response;
  } else {
    content = downloadContent;
  }

  if (typeof content === 'string')
    content = new Blob(isBomAdded ? [new Uint8Array([0xef, 0xbb, 0xbf]), content] : [content]);

  const url = URL.createObjectURL(content);
  const anchor = document.createElement('a');
  anchor.setAttribute('download', fileName || '');
  anchor.setAttribute('href', url);

  const mouseEvent = new MouseEvent('click');
  anchor.dispatchEvent(mouseEvent);
  URL.revokeObjectURL(url);
};
