const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i;

exports.validateUser = (data) => {
  const errors = [];
  if (!data.full_name) errors.push("Full name is required.");
  if (!data.mob_num || !/^\+?91?0?\d{10}$/.test(data.mob_num)) errors.push("Invalid mobile number.");
  if (!data.pan_num || !panRegex.test(data.pan_num)) errors.push("Invalid PAN number.");
  if (!data.manager_id) errors.push("Manager ID is required.");
  return errors;
};

exports.normalizeMobile = (num) => num.replace(/^(\+91|0)/, '');
