import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const colors = await request.json();
    const cssVariables = `
$primary-color: ${colors.primary};
$secondary-color: ${colors.secondary};
$accent-color: ${colors.accent};
$text-color: ${colors.text};
$background-color: ${colors.background};
`;

    const filePath = path.join(process.cwd(), 'src/styles/variables.scss');
    fs.writeFileSync(filePath, cssVariables);

    return NextResponse.json({ message: 'Colors updated successfully' });
  } catch (error) {
    console.error('Error updating colors:', error);
    return NextResponse.json({ message: 'Error updating colors' }, { status: 500 });
  }
}