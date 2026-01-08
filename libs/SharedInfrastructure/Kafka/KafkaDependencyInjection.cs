using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SharedInfrastructure.Kafka.Abstractions;
using SharedInfrastructure.Kafka.Producer;

namespace SharedInfrastructure.Kafka;

public static class KafkaDependencyInjection
{
  public static IServiceCollection AddKafka(this IServiceCollection services, IConfiguration config)
  {
    services.Configure<KafkaOptions>(config.GetSection("Kafka"));
    services.AddSingleton<IKafkaProducer, KafkaProducer>();
    return services;
  }
}
