import React, { useState, useEffect } from "react";
import HeroSection from "./HeroSection";
import Notes from "./Notes";

const WallCalendar = () => {
  const [viewDate, setViewDate] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [notes, setNotes] = useState("");
  const [noteDate, setNoteDate] = useState(null);
  const [data, setdata] = useState([]);

  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  const saveDataInLocalStorage = () => {
    const existing = JSON.parse(localStorage.getItem("calendar-data")) || [];

    const id = noteDate ? noteDate.getDate() : 0;

    const newEntry = {
      id: id,
      date: noteDate ? noteDate.toISOString() : null,
      note: notes || "",
    };

    const index = existing.findIndex((item) => item.id === id);

    if (index !== -1) {
      existing[index] = newEntry;
    } else {
      existing.push(newEntry);
    }

    localStorage.setItem("calendar-data", JSON.stringify(existing));
    setdata(existing);
    setNotes("");
  };
  const getDataInLocalStorage = () => {
    const saved = JSON.parse(localStorage.getItem("calendar-data")) || [];

    if (saved.length === 0) return;

    setdata(saved);
  };

  useEffect(() => {
    getDataInLocalStorage();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      saveDataInLocalStorage();
    }, 10000);

    return () => clearTimeout(timeout);
  }, [notes, noteDate]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);

  const firstDayIndex = (getFirstDayOfMonth(year, month) + 6) % 7;

  const days = [];
  const prevMonthDays = getDaysInMonth(year, month - 1);

  for (let i = 0; i < firstDayIndex; i++) {
    days.push({
      day: prevMonthDays - firstDayIndex + i + 1,
      isCurrentMonth: false,
      date: new Date(year, month - 1, prevMonthDays - firstDayIndex + i + 1),
    });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      isCurrentMonth: true,
      date: new Date(year, month, i),
    });
  }

  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      day: i,
      isCurrentMonth: false,
      date: new Date(year, month + 1, i),
    });
  }

  const handleDateClick = (clickedDate) => {
    setNoteDate(clickedDate);

    if (!startDate || (startDate && endDate)) {
      setStartDate(clickedDate);
      setEndDate(null);
    } else if (clickedDate < startDate) {
      setStartDate(clickedDate);
    } else {
      setEndDate(clickedDate);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveDataInLocalStorage();
      getDataInLocalStorage();
    }
  };

  const isSameDay = (d1, d2) => d1 && d2 && d1.getTime() === d2.getTime();

  const isBetween = (date) =>
    startDate && endDate && date > startDate && date < endDate;

  const changeMonth = (offset) => {
    setViewDate(new Date(year, month + offset, 1));
  };

  const monthNames = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white max-w-3xl w-full shadow-2xl rounded-sm overflow-hidden relative">
        <HeroSection year={year} month={month} monthNames={monthNames} />

        <div className="p-8 flex flex-col-reverse md:flex-row gap-12">
          <div className="w-full md:w-1/3 flex flex-col">
            <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">
              Notes
            </h3>
            <textarea
              className="w-full flex-grow min-h-[200px] resize-none outline-none bg-transparent text-sm text-gray-600 leading-8"
              style={{
                backgroundImage:
                  "linear-gradient(transparent, transparent 31px, #e5e7eb 31px, #e5e7eb 32px)",
                backgroundSize: "100% 32px",
                lineHeight: "32px",
              }}
              placeholder="Write your memos here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {data.length ? <Notes data={data} /> : <p>No notes yet</p>}
          </div>

          <div className="w-full md:w-2/3">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => changeMonth(-1)}
                className="text-gray-400 hover:text-[#0084C9] transition font-bold"
              >
                &larr; Prev
              </button>
              <h2 className="text-xl font-semibold text-gray-800">
                {monthNames[month]} {year}
              </h2>
              <button
                onClick={() => changeMonth(1)}
                className="text-gray-400 hover:text-[#0084C9] transition font-bold"
              >
                Next &rarr;
              </button>
            </div>

            <div className="grid grid-cols-7 mb-4">
              {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
                (day, i) => (
                  <div
                    key={day}
                    className={`text-center text-xs font-bold ${i >= 5 ? "text-[#0084C9]" : "text-gray-500"}`}
                  >
                    {day}
                  </div>
                ),
              )}
            </div>

            <div className="grid grid-cols-7 gap-y-4">
              {days.map((dayObj, i) => {
                const isStart = isSameDay(dayObj.date, startDate);
                const isEnd = isSameDay(dayObj.date, endDate);
                const isMid = isBetween(dayObj.date);

                let textColor = "text-gray-800";
                if (!dayObj.isCurrentMonth) textColor = "text-gray-300";
                if (dayObj.isCurrentMonth && (i % 7 === 5 || i % 7 === 6))
                  textColor = "text-[#0084C9] font-semibold"; // Weekends
                if (isStart || isEnd) textColor = "text-white font-bold";

                let bgColor = "bg-transparent";
                if (isStart || isEnd)
                  bgColor =
                    "bg-[#0084C9] rounded-full shadow-md transform scale-110";
                else if (isMid) bgColor = "bg-blue-50 rounded-none";

                return (
                  <div
                    key={i}
                    className={`relative flex justify-center items-center h-10 ${isMid ? "bg-blue-50" : ""}`}
                  >
                    {isStart && endDate && (
                      <div className="absolute right-0 w-1/2 h-10 bg-blue-50"></div>
                    )}
                    {isEnd && startDate && (
                      <div className="absolute left-0 w-1/2 h-10 bg-blue-50"></div>
                    )}

                    <button
                      onClick={() => handleDateClick(dayObj.date)}
                      className={`relative z-10 w-8 h-8 flex items-center justify-center text-sm transition-all duration-200 hover:bg-gray-100 hover:rounded-full ${bgColor} ${textColor}`}
                    >
                      {dayObj.day}
                    </button>
                  </div>
                );
              })}
            </div>

            {startDate && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setStartDate(null);
                    setEndDate(null);
                  }}
                  className="text-xs text-gray-400 hover:text-red-500 transition underline"
                >
                  Clear Selection
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WallCalendar;
