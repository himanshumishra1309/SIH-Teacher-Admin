import axios from 'axios';

export const getAllTables = async (extraTables) => {
  const tables = [];

  // Get tables from the current view
  document.querySelectorAll('table').forEach((table) => {
    const clonedTable = table.cloneNode(true);
    // Remove any non-table elements
    clonedTable.querySelectorAll('button, input, select').forEach((el) => el.remove());
    tables.push(clonedTable);
  });

  // Process and add extra tables
  for (const tableHTML of extraTables) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = tableHTML;
    const extraTable = tempDiv.querySelector('table');
    if (extraTable) {
      // Remove any non-table elements
      extraTable.querySelectorAll('button, input, select').forEach((el) => el.remove());
      tables.push(extraTable);
    }
  }

  // Fetch additional tables from other navigation items
  const navigationItems = ['research', 'teaching', 'service']; // Add all your navigation items here
  for (const item of navigationItems) {
    try {
      const response = await axios.get(`http://localhost:6005/api/v1/teachers/${item}Tables`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('teacherAccessToken')}`,
        },
      });
      const fetchedTables = response.data.tables || [];
      for (const tableHTML of fetchedTables) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = tableHTML;
        const fetchedTable = tempDiv.querySelector('table');
        if (fetchedTable) {
          // Remove any non-table elements
          fetchedTable.querySelectorAll('button, input, select').forEach((el) => el.remove());
          tables.push(fetchedTable);
        }
      }
    } catch (error) {
      console.error(`Error fetching ${item} tables:`, error);
    }
  }

  return tables;
};
