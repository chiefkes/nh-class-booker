import { DateTime } from "luxon";

export default function getMinDate() {
  let timeNow = DateTime.utc();
  if (timeNow.hour < 7) {
    return timeNow.plus({ days: 8 }).toFormat("yyyy-MM-dd");
  } else {
    return timeNow.plus({ days: 9 }).toFormat("yyyy-MM-dd");
  }
}
