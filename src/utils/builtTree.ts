// src/utils/buildTree.ts
export interface TreeNode {
    name: string;
    path: string;
    children?: TreeNode[];
    fileContent?: string; 
  }
  
  export function buildFileTree(filePaths: Record<string, string>): TreeNode[] {
    // The tree is built as a nested object keyed by folder name.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tree: { [key: string]: any } = {};
  
    // Helper function to recursively add a file or folder
    function addPath(parts: string[], fileContent: string) {
      let current = tree;
      let currentPath = '';
      parts.forEach((part, index) => {
        currentPath += `/${part}`;
        if (!current[part]) {
          // If we’re at the leaf, add fileContent; otherwise, create a folder node.
          current[part] = {
            name: part,
            path: currentPath,
            ...(index === parts.length - 1 && { fileContent }),
            children: {},
          };
        }
        current = current[part].children;
      });
    }
  
    // Process each file path.
    Object.entries(filePaths).forEach(([path, content]) => {
      // Adjust the path so that it is relative to your "notes" folder.
      // For example, a path like "../../notes/concordia/computer-science/COMP348/file.md"
      // becomes ["concordia", "computer-science", "COMP348", "file.md"]
      const parts = path.split('/').filter(
        (part) => part && part !== '.' && part !== '..'
      );
      const notesIndex = parts.findIndex((p) => p.toLowerCase() === 'notes');
      const relativeParts = notesIndex >= 0 ? parts.slice(notesIndex + 1) : parts;
      addPath(relativeParts, content);
    });
  
    // Convert the nested object to an array of TreeNodes, turning children objects into arrays.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function convert(obj: any): TreeNode {
      const { name, path, fileContent, children } = obj;
      const childrenArray = children
        ? Object.values(children).map(convert)
        : undefined;
      return { name, path, fileContent, children: childrenArray?.length ? childrenArray : undefined };
    }
  
    return Object.values(tree).map(convert);
  }
  