// Get model schema from CMS
export const getModelSchema = async (
  baseUrl: string,
  workspaceId: string,
  projectId: string,
  modelId: string,
  token: string,
): Promise<any> => {
  try {
    const response = await fetch(
      `${baseUrl}/${workspaceId}/projects/${projectId}/models/${modelId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`CMS API Error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Unknown error occurred");
  }
};

// Upload data to CMS
export const uploadToCMS = async (
  baseUrl: string,
  workspaceId: string,
  projectId: string,
  modelId: string,
  token: string,
  data: Record<string, string>,
  fieldMap: Map<string, string>,
): Promise<any> => {
  try {
    // Map CSV data to CMS fields using pre-built field map
    const fields = Object.entries(data)
      .filter(([key]) => fieldMap.has(key))
      .map(([key, value]) => ({
        key,
        type: fieldMap.get(key)!,
        value,
      }));

    const response = await fetch(
      `${baseUrl}/${workspaceId}/projects/${projectId}/models/${modelId}/items`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`CMS API Error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Unknown error occurred");
  }
};
