import { Button } from '@heroui/button'
import { useState, useEffect } from 'react'

export default function NoteInput({ onChange, initialNotes }: { onChange?: (notes: string[]) => void, initialNotes?: string[] }) {
    const [notes, setNotes] = useState<string[]>(initialNotes && initialNotes.length > 0 ? initialNotes : [''])

    useEffect(() => {
        onChange?.(notes)
    }, [notes])

    const addNote = () => {
        setNotes([...notes, ''])
    }

    const deleteNote = (index: number) => {
        setNotes(notes.filter((_, i) => i !== index))
    }

    const updateNote = (index: number, value: string) => {
        const newNotes = [...notes]
        newNotes[index] = value
        setNotes(newNotes)
    }

  return (
    <div className='mt-6 space-y-4'>
        <div className='flex items-center justify-between'>
            <h2 className='text-base font-medium'>Notes</h2>
            <Button size="sm" variant='bordered' radius='full' onClick={addNote}>add note</Button>
        </div>
        <div className='space-y-2'>
            {notes.map((note, index) => (
            <div key={index} className='flex items-center gap-2'>
                <input 
                type="text" 
                placeholder='e.g Pack a swimsuit' 
                value={note}
                onChange={(e) => updateNote(index, e.target.value)}
                className="flex-1 p-3 px-4 rounded-xl bg-gray-100 border-none focus:outline-none focus:ring-none placeholder:text-[#787878]"
                />
                {notes.length > 1 && (
                <button
                    onClick={() => deleteNote(index)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#E03E1A"/>
                    </svg>
                </button>
                )}
            </div>
            ))}
        </div>
    </div>
  )
}
