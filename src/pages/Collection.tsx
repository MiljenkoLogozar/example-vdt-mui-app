import { useParams } from 'react-router-dom';

export function Collection() {
  const { collectionId } = useParams();
  return <h2 style={{ margin: '16px', textAlign: 'center' }}>Collection View {collectionId}</h2>;
}

export default Collection;
