import React from 'react';
import { format } from 'date-fns';

function DateFormatCo({currentDate}) {
  const formattedDate = format(currentDate, 'MMMM d, yyyy');

  return (
    <div>
      <p>Current Date: {formattedDate}</p>
    </div>
  );
}

export default DateFormatCo;
