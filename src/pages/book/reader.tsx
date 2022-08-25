// import { useState, useEffect } from 'react';
// import { Document } from 'react-pdf';
// import { useRouter } from 'next/router';

function Reader() {
  return <> </>;
}
//     const router= useRouter();
//     const [bookPath, setBookPath] = useState("");
//     useEffect(() => {
//         if (router.isReady) {
//           setBookPath(`/uploads/files/${router.query.bookPath as string}`);
//         }
//       }, [router.isReady, router.query.bookPath]);

// 	const [numPages, setNumPages] = useState(0);
// 	const [pageNumber, setPageNumber] = useState(1);

//     function onDocumentLoadSuccess({ numPages }) {
//       setNumPages(2);
//     }

//     return (
//       <div>
//         <Document file="/public/uploads/files/add5d1f3-482c-4a1f-80d2-a00d4106627f.pdf" onLoadSuccess={onDocumentLoadSuccess}>
//           {/* <Page pageNumber={pageNumber} /> */}
//         </Document>
//         <p>
//           Page {pageNumber} of {numPages}
//         </p>
//       </div>
//     );
// }
export default Reader;
