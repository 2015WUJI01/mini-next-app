import React from 'react';
import { Button } from "@/components/ui/button"
export default function Home() {


  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="font-bold underline">
        Hello world!
      </p>
      <Button>Click me</Button>
    </div>
  )
}
