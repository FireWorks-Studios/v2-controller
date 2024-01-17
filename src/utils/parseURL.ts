export function parseScratchProjectId(urlOrId: string): string | undefined {
    const regex = /(\d+)/; // Regex to match one or more digits
  
    // Check if the input string matches the full URL format
    const matchUrl = urlOrId.match(/scratch\.mit\.edu\/projects\/(\d+)/);
  
    if (matchUrl) {
      return matchUrl[1]; // Return the captured group (project ID)
    }
  
    // Check if the input string matches the URL format without the slash at the end
    const matchUrlWithoutSlash = urlOrId.match(/scratch\.mit\.edu\/projects\/(\d+)$/);
  
    if (matchUrlWithoutSlash) {
      return matchUrlWithoutSlash[1]; // Return the captured group (project ID)
    }
  
    // Check if the input string contains only the project ID
    const matchId = urlOrId.match(regex);
  
    if (matchId) {
      return matchId[0]; // Return the matched digits (project ID)
    }
  
    // Return undefined if no match is found
    return undefined;
  }