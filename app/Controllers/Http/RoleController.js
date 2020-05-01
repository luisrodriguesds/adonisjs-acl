'use strict'

const Role = use('Role')

class RoleController {
  async index () {
    const roles = await Role.query().with('permissions').fetch()
    return roles
  }

  async show ({params}) {
    const role = await Role.findOrFail(params.id)
    await role.load('permission')
    return role
  }

  async store ({ request }) {
    const { permission, ...data } = request.only([
      'name',
      'slug',
      'description',
      'permission'
    ])

    const role = await Role.create(data)

    if (permission) {
      await role.permissions().attach(permission)
    }

    await role.load('permissions')

    return role
  }

  async update ({ request, params }) {
    const { permission, ...data } = request.only([
      'name',
      'slug',
      'description',
      'permission'
    ])

    const role = await Role.findOrFail(params.id)

    role.merge(data)

    await role.save()

    if (permission) {
      await role.permissions().sync(permission)
    }

    await role.load('permissions')

    return role
  }

  async destroy ({ params }) {
    const role = await Role.findOrFail(params.id)

    await role.delete()
  }
}

module.exports = RoleController
