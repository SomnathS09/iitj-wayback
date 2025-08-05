// To replace slots with subjects and classroom, run this app script from extension of sheets

function replaceSlotsWithMultipleSubjects() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  const timetableSheet = ss.getSheetByName("timetable");
  const mappingSheet = ss.getSheetByName("Classroom Allocation");

  // Load mapping data
  const data = mappingSheet.getDataRange().getValues();
  const headers = data[0];

  const slotCol = headers.indexOf("Slot");
  const subjectCol = headers.indexOf("Subject");
  const roomCol = headers.indexOf("Classroom");

  if (slotCol === -1 || subjectCol === -1 || roomCol === -1) {
    throw new Error("Required columns (Slot, Subject, Classroom) not found.");
  }

  // Create slotMap: { A: ["DBMS (R101)", "AI (R102)"], ... }
  const slotMap = {};
  for (let i = 1; i < data.length; i++) {
    const slotRaw = data[i][slotCol];
    const subject = data[i][subjectCol];
    const room = data[i][roomCol];

    const slot = typeof slotRaw === "string" ? slotRaw.trim() : slotRaw;

    if (slot && subject && room) {
      const formatted = `${subject} (${room})`;
      if (!slotMap[slot]) {
        slotMap[slot] = [];
      }
      if (!slotMap[slot].includes(formatted)) {
        slotMap[slot].push(formatted);
      }
    }
  }

  // Read and replace timetable
  const range = timetableSheet.getDataRange();
  const values = range.getValues();

  for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < values[i].length; j++) {
      const cellRaw = values[i][j];
      const cell = typeof cellRaw === "string" ? cellRaw.trim() : cellRaw;

      if (typeof cell === "string" && slotMap[cell]) {
        values[i][j] = slotMap[cell].join(", ");
      }
    }
  }

  range.setValues(values);
}
