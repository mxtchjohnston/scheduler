import { useState } from "react";

export default function useVisualMode(initial) {
  const [history, setHistory] = useState([initial]); 

  function transition(newMode, replace=false){
    console.log(newMode);
    setHistory(prev => replace ? [...prev.slice(0, prev.length - 1)].concat(newMode): [...prev, newMode])
  }

  function back() {
    setHistory(prev => prev.length === 1 ? prev : [...prev.slice(0, prev.length - 1)])
  }

  return { mode: history[history.length -1], transition, back };
}