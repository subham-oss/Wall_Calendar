import React from 'react'

const Notes = ({ data }) => {
  return (
    <div>
       {data.map((item, index) => (
        <div key={item.id} className="mb-2">
          <p className="text-sm text-gray-600">{item.note}</p>
          <p className="text-sm text-gray-600">
            {item.date==null ? "No date" : new Date(item.date).toDateString()}
          </p>
        </div>
      ))}
    </div>
  )
}

export default Notes
