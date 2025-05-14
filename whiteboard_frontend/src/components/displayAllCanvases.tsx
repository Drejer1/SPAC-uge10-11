import {useState, useEffect} from "react";


type canvasDTO = {
    item1: string;
    item2: string;
};

const DisplayAllCanvases = () => {
    const [files, setFiles] = useState<canvasDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
       fetch('http://localhost:5203/api/canvas')
           .then(res =>{ if(!res.ok){
               throw new Error('Failed to fetch');
        }return res.json()})
           .then(data => {
               setFiles(data);
               setIsLoading(false);
           })
           .catch(error => {
               setError(error);
               setIsLoading(false);
           })
    }, []);
    if (isLoading) return <div> Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Files</h1>
            <div>
                {files.map((file, index) => (
                    <div key={index}>
                        <h3>{file.item1}</h3>
                        <img
                            src={`data:image/jpeg;base64,${file.item2}`} // assuming content is base64
                            alt={file.item1}
                            style={{ maxWidth: '200px', maxHeight: '100px' }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DisplayAllCanvases;