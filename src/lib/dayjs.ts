import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localeData from "dayjs/plugin/localeData";
import localizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";
import weekOfYear from "dayjs/plugin/weekOfYear";
import "dayjs/locale/th";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(buddhistEra);
dayjs.extend(customParseFormat);
dayjs.extend(localeData);
dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(weekOfYear);
dayjs.locale("th");
dayjs.extend(timezone);

export default dayjs;
