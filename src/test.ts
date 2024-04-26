import Crust from ".";

async function main() {
  const crust = new Crust(
    "unveil alone icon west lottery major network inhale famous supreme boat write"
  );
  const res = await crust.addPrepaidAmount(
    "QmQvz8ZmdkPGhs1vZgPSGi8SNUsL6xSAs1QSFvFUHhL9aT",
    1
  );

  console.log(res);
}

main();
