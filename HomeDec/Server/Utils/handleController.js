const handleController = ([ctr1, ctr2, ctr3]) => {
  return (req,res) => {
    const { role } = req.user;

    switch (role) {
      case "user":
        return userController;
      case "seller":
        return sellerController;
      case "admin":
        return adminController;
    }
  };
};
