import PairingForm from '../PairingForm';

export default function PairingFormExample() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <PairingForm 
        onPair={(phoneNumber) => console.log('Pairing request:', phoneNumber)}
      />
    </div>
  );
}