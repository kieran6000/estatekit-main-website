import WistiaPlayer from './WistiaPlayer'
import YouTubePlayer from './YouTubePlayer'

/**
 * TestimonialVideo
 *
 * Props:
 *  - type: 'wistia' | 'youtube' | 'audio'  (default: 'wistia')
 *  - mediaId: Wistia media ID (required when type === 'wistia')
 *  - youtubeId: YouTube video ID (required when type === 'youtube')
 *  - audioSrc: path to audio file (required when type === 'audio')
 *  - name: agent name + location string
 *  - result: result / achievement string
 */
export default function TestimonialVideo({ type = 'wistia', mediaId, youtubeId, audioSrc, name, result }) {
  return (
    <div className="mb-10 md:mb-12">
      <div className="video-wrap">
        {type === 'wistia' && mediaId && (
          <WistiaPlayer mediaId={mediaId} />
        )}

        {type === 'youtube' && youtubeId && (
          <YouTubePlayer videoId={youtubeId} title={name} />
        )}

        {type === 'audio' && audioSrc && (
          <audio controls className="mx-auto w-full">
            <source src={audioSrc} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}
      </div>

      <div className="mt-3 text-center">
        <p className="font-semibold text-slate-900 text-base md:text-lg">{name}</p>
        <p className="text-brand text-base md:text-lg font-bold">{result}</p>
      </div>
    </div>
  )
}
