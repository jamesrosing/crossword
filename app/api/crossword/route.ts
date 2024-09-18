// app/api/crossword/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CrosswordClue {
  id: number;
  number: number;
  clue: string;
  answer: string;
  direction: 'across' | 'down';
}

export async function GET(request: Request) {
  try {
    console.log('Handling GET request to /api/crossword');

    const crosswordData: CrosswordClue[] = await prisma.crosswordClue.findMany();

    return NextResponse.json({ 
      message: 'Crossword data retrieved successfully',
      data: crosswordData
    });

  } catch (error) {
    console.error('Error in /api/crossword:', error);
    return NextResponse.json(
      { error: 'An error occurred while retrieving crossword data' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('Handling POST request to /api/crossword');

    const body: Omit<CrosswordClue, 'id'> = await request.json();// app/api/crossword/route.ts
import { NextResponse } from 'next/server';

interface CrosswordClue {
  number: number;
  clue: string;
  answer: string;
  direction: 'across' | 'down';
}

const crosswordData: CrosswordClue[] = [
  { number: 1, clue: "Capital of France", answer: "PARIS", direction: "across" },
  { number: 2, clue: "Largest planet in our solar system", answer: "JUPITER", direction: "down" },
  { number: 3, clue: "Earth's natural satellite", answer: "MOON", direction: "across" },
  { number: 4, clue: "Frozen water", answer: "ICE", direction: "down" },
  { number: 5, clue: "Opposite of hot", answer: "COLD", direction: "across" }
];

export async function GET(request: Request) {
  try {
    console.log('Handling GET request to /api/crossword');

    // Simulate a delay to mimic database fetch
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return the crossword data
    return NextResponse.json({ 
      message: 'Crossword data retrieved successfully',
      data: crosswordData
    });

  } catch (error) {
    console.error('Error in /api/crossword:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('Handling POST request to /api/crossword');

    const body = await request.json();
    console.log('Received data:', body);

    // Here you would typically validate the input and save it to a database
    // For this example, we'll just echo back the received data

    return NextResponse.json({ 
      message: 'Data received successfully',
      receivedData: body
    });

  } catch (error) {
    console.error('Error in POST /api/crossword:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' }, 
      { status: 500 }
    );
  }
}

    const newClue = await prisma.crosswordClue.create({
      data: {
        number: body.number,
        clue: body.clue,
        answer: body.answer,
        direction: body.direction
      }
    });

    return NextResponse.json({ 
      message: 'Crossword clue created successfully',
      data: newClue
    }, { status: 201 });

  } catch (error) {
    console.error('Error in POST /api/crossword:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the crossword clue' }, 
      { status: 500 }
    );
  }
}