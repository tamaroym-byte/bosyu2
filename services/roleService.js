const db =
  require('../db/database');

async function checkAndGrantRoles(
  member,
  totalXP
) {

  const roles =
    db.prepare(`
      SELECT *
      FROM xp_roles
      WHERE guild_id=?
    `).all(
      member.guild.id
    );

  for (const roleData of roles) {

    if (
      totalXP >=
      roleData.required_xp
    ) {

      const role =
        member.guild.roles.cache.get(
          roleData.role_id
        );

      if (!role)
        continue;

      if (
        !member.roles.cache.has(
          role.id
        )
      ) {

        await member.roles.add(
          role
        );
      }
    }
  }
}

module.exports = {
  checkAndGrantRoles
};
