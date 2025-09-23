export class Time {
  public static FormatDuration(duration: number) {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    let time = "";
    if (hours > 0) {
      time += `${hours.toString().padStart(2, "0")}:`;
    }
    time += `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
    return time;
  }
}
