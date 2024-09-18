export const playAudio = async (trackId: string) => {
    try {
        if (!trackId) {
            console.warn("Audio Processer: Got Empty Track Id - Skipped");
            return;
        };
        const audio = new Audio(require(`./sounds/${trackId}.mp3`));
        await new Promise<void>((resolve, reject) => {
            audio.play().then(() => {
                console.debug("Audio Processer: Playing " + trackId);
            }).catch(error => {
                console.error("Audio Processer: Error playing " + trackId, error);
                reject(error);
            });

            audio.onended = () => {
                console.debug("Audio Processer: Finish Playing " + trackId);
                resolve();
            };
        });
        // await new Promise((r) => {setTimeout(r, 2000)});
        return;
    } catch (error) {
        console.error('Audio Processer: Cannot find track' + trackId + '\n' + error);
        return;
    }
};