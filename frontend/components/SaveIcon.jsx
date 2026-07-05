import React from 'react'

const SaveIcon = ({handleSave, isSaved, saveCounts}) => {
  return (
        <div className="flex flex-col items-center justify-center w-max">
          <button
            onClick={handleSave}
            className="bg-zinc-950/50 backdrop-blur-sm border border-zinc-800/60 p-3 rounded-full text-white hover:bg-zinc-800/80 transition active:scale-90 shadow-2xl cursor-pointer flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={isSaved ? "currentcolor" : "none"}
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 text-white hover:text-yellow-500 transition-colors"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.154 1.907 1.101 1.907 2.214v15.586c0 .895-.996 1.432-1.743.935L12 17.518l-5.757 4.54c-.747.497-1.743-.04-1.743-.936V5.536c0-1.113.808-2.06 1.907-2.214a48.554 48.554 0 0 1 11.186 0Z"
              />
            </svg>
          </button>
          <span className="text-[11px] font-semibold text-zinc-200 mt-1 drop-shadow-md text-center block w-full">
            {saveCounts}
          </span>
        </div>
  )
}

export default SaveIcon
