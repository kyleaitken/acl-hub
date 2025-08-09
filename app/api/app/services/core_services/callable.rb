module CoreServices
  module Callable
    def self.included(base)
      base.extend(ClassMethods)
    end

    module ClassMethods
      def call(*args, &block)
        new(*args, &block).call
      end
    end

    private

    def Success(payload = {})
      { success: true, **payload }
    end

    def Failure(payload = {})
      { success: false, errors: payload[:errors] || payload }
    end
  end
end