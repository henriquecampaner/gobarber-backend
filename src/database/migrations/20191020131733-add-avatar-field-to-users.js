module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'avatar_id', {
      // adiciona coluna na tabela users com o nome avatar_id
      type: Sequelize.INTEGER,
      references: { model: 'files', key: 'id' },
      // criar uma chave estrangeira para a tabela files com o id
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'avatar_id');
  },
};
