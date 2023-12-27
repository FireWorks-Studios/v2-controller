
export function lighten(color = '#004488', opacity = 1) {
    // Convert to color channels
    const num = parseInt(color.slice(1), 16)
    let R = num >> 16,
      G = (num >> 8) & 0x00ff,
      B = num & 0x0000ff
  
    // Interpolate channel
    opacity = Math.min(Math.max(opacity, -1), 1)
    R = Math.round(R + (opacity) * (255 - R))
    G = Math.round(G + (opacity) * (255 - G))
    B = Math.round(B + (opacity) * (255 - B))
  
    // Encode as hex
    return (
      '#' +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    )
  }