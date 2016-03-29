﻿using IkeCode.Clinike.Person.Domain.Entities;
using IkeCode.Clinike.Person.Domain.Repository;
using IkeCode.Data.Core.Repository;
using System.Data.Entity;

namespace IkeCode.Clinike.Person.Repository
{
    public class PhoneRepository : IkeCodeRepositoryBase<Phone, IPhone, int>, IPhoneRepository
    {
        public PhoneRepository(DbContext context)
            : base(context)
        {

        }
    }
}
