export const playAudio = async (trackId: string) => {
    console.log("Audio Processer: Playing" + trackId)
    await new Promise((r) => {setTimeout(r, 2000)});
    console.log("Audio Processer: Finish Playing" + trackId)
};