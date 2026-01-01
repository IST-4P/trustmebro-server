using Microsoft.EntityFrameworkCore;
using Report.Domain.Entities; 

namespace Report.Infrastructure.Persistence
{
    public class ReportDbContext : DbContext
    {
        public ReportDbContext(DbContextOptions<ReportDbContext> options)
            : base(options)
        {
        }

        public DbSet<ReportEntity> Reports { get; set; }
        public DbSet<ReportEvidence> ReportEvidences { get; set; }
        public DbSet<ReportComment> ReportComments { get; set; }
        public DbSet<ReportHistory> ReportHistories { get; set; }
        public DbSet<ReportAction> ReportActions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // REPORT
            modelBuilder.Entity<ReportEntity>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id).HasMaxLength(50);
                entity.Property(e => e.ReporterId).IsRequired().HasMaxLength(50);
                entity.Property(e => e.TargetId).IsRequired().HasMaxLength(50);
                entity.Property(e => e.AssignedAdminId).HasMaxLength(50);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Description).IsRequired().HasMaxLength(2000);

                entity.Property(e => e.TargetType).HasConversion<string>().HasMaxLength(20);
                entity.Property(e => e.Category).HasConversion<string>().HasMaxLength(20);
                entity.Property(e => e.Status).HasConversion<string>().HasMaxLength(20);

                // Indexes for performance optimization
                entity.HasIndex(e => e.ReporterId).HasDatabaseName("IX_Reports_ReporterId");
                entity.HasIndex(e => e.TargetId).HasDatabaseName("IX_Reports_TargetId");
                entity.HasIndex(e => e.Status).HasDatabaseName("IX_Reports_Status");
                entity.HasIndex(e => e.Category).HasDatabaseName("IX_Reports_Category");
                entity.HasIndex(e => e.TargetType).HasDatabaseName("IX_Reports_TargetType");
                entity.HasIndex(e => e.AssignedAdminId).HasDatabaseName("IX_Reports_AssignedAdminId");
                entity.HasIndex(e => e.CreatedAt).HasDatabaseName("IX_Reports_CreatedAt");
                entity.HasIndex(e => e.IsDeleted).HasDatabaseName("IX_Reports_IsDeleted");
                
                // Composite indexes for common filter queries
                entity.HasIndex(e => new { e.Status, e.CreatedAt }).HasDatabaseName("IX_Reports_Status_CreatedAt");
                entity.HasIndex(e => new { e.ReporterId, e.IsDeleted }).HasDatabaseName("IX_Reports_ReporterId_IsDeleted");
                entity.HasIndex(e => new { e.TargetId, e.TargetType }).HasDatabaseName("IX_Reports_TargetId_TargetType");

                entity.HasMany(e => e.Evidences)
                      .WithOne(x => x.Report)
                      .HasForeignKey(x => x.ReportId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(e => e.Comments)
                      .WithOne(x => x.Report)
                      .HasForeignKey(x => x.ReportId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(e => e.History)
                      .WithOne(x => x.Report)
                      .HasForeignKey(x => x.ReportId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(e => e.Actions)
                      .WithOne(x => x.Report)
                      .HasForeignKey(x => x.ReportId)
                      .OnDelete(DeleteBehavior.Cascade);

                // Soft delete query filter
                entity.HasQueryFilter(e => !e.IsDeleted);
            });

            // EVIDENCE
            modelBuilder.Entity<ReportEvidence>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasMaxLength(50);
                entity.Property(e => e.ReportId).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Url).IsRequired().HasMaxLength(500);
                entity.Property(e => e.EvidenceType).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Note).HasMaxLength(500);

                entity.HasIndex(e => e.ReportId).HasDatabaseName("IX_ReportEvidences_ReportId");
                entity.HasIndex(e => e.EvidenceType).HasDatabaseName("IX_ReportEvidences_EvidenceType");
            });

            // COMMENT
            modelBuilder.Entity<ReportComment>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasMaxLength(50);
                entity.Property(e => e.ReportId).IsRequired().HasMaxLength(50);
                entity.Property(e => e.UserId).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Role).IsRequired().HasMaxLength(20);
                entity.Property(e => e.Comment).IsRequired().HasMaxLength(1000);

                entity.HasIndex(e => e.ReportId).HasDatabaseName("IX_ReportComments_ReportId");
                entity.HasIndex(e => e.UserId).HasDatabaseName("IX_ReportComments_UserId");
                entity.HasIndex(e => new { e.ReportId, e.CreatedAt }).HasDatabaseName("IX_ReportComments_ReportId_CreatedAt");
            });

            // HISTORY 
            modelBuilder.Entity<ReportHistory>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasMaxLength(50);
                entity.Property(e => e.ReportId).IsRequired().HasMaxLength(50);
                entity.Property(e => e.AdminId).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Note).HasMaxLength(500);

                entity.Property(e => e.OldStatus).HasConversion<string>().HasMaxLength(20);
                entity.Property(e => e.NewStatus).HasConversion<string>().HasMaxLength(20);

                entity.HasIndex(e => e.ReportId).HasDatabaseName("IX_ReportHistories_ReportId");
                entity.HasIndex(e => e.AdminId).HasDatabaseName("IX_ReportHistories_AdminId");
                entity.HasIndex(e => new { e.ReportId, e.CreatedAt }).HasDatabaseName("IX_ReportHistories_ReportId_CreatedAt");
            });

            // ACTION 
            modelBuilder.Entity<ReportAction>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasMaxLength(50);
                entity.Property(e => e.ReportId).IsRequired().HasMaxLength(50);
                entity.Property(e => e.AdminId).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Reason).HasMaxLength(500);

                entity.Property(e => e.ActionType).HasConversion<string>().HasMaxLength(50);

                entity.HasIndex(e => e.ReportId).HasDatabaseName("IX_ReportActions_ReportId");
                entity.HasIndex(e => e.AdminId).HasDatabaseName("IX_ReportActions_AdminId");
                entity.HasIndex(e => e.ActionType).HasDatabaseName("IX_ReportActions_ActionType");
            });
        }
    }
}
