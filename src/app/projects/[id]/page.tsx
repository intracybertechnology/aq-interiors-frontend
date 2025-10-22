import { Metadata } from 'next';

// This will be dynamic based on the project
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  // You can fetch project data here and create dynamic metadata
  // For now, using static data
  
  return {
    title: `Project Details | AQ Decor`,
    description: 'View detailed information about this commercial fit-out project by AQ Decor Dubai',
    openGraph: {
      title: `Project Details | AQ Decor`,
      description: 'View detailed information about this commercial fit-out project by AQ Decor Dubai',
    },
  };
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      {/* Your project detail content */}
      <h1>Project Detail: {params.id}</h1>
      {/* Add your project detail content here */}
    </div>
  );
}