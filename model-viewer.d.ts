declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        src?: string
        alt?: string
        'camera-controls'?: boolean
        'auto-rotate'?: boolean
        'auto-rotate-delay'?: string
        'rotation-per-second'?: string
        'shadow-intensity'?: string
        'shadow-softness'?: string
        'environment-image'?: string
        exposure?: string
        'camera-orbit'?: string
        'min-camera-orbit'?: string
        'max-camera-orbit'?: string
        'interaction-prompt'?: string
        'field-of-view'?: string
        'touch-action'?: string
        style?: React.CSSProperties
        ref?: any
      },
      HTMLElement
    >
  }
}