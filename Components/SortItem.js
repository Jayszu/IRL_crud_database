const sortItems = (items, sortOrder) => {
    return [...items].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.Item.localeCompare(b.Item);
      } else {
        return b.Item.localeCompare(a.Item);
      }
    });
  };
  
  export default sortItems;
  